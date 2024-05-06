class Admin::SessionsController < ActiveAdmin::Devise::SessionsController

    def create
        if check_user_role(current_user)
            self.resource = warden.authenticate!(auth_options)
            set_flash_message!(:notice, :signed_in)
            sign_in(resource_name, resource)
            yield resource if block_given?

            redirect_to admin_dashboard_path
        else
            if current_user.nil?
                flash[:alert] = 'Invalid username or password'
                redirect_to new_user_session_path
            else
                Devise.sign_out_all_scopes ? sign_out : sign_out(current_user)
                flash[:alert] = "You are not authorized to access this page"
                redirect_to new_user_session_path
            end
        end
    end

    def destroy
        signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(current_user))
        set_flash_message! :notice, :signed_out if signed_out
        yield if block_given?

        redirect_to new_user_session_path if signed_out
    end

    def check_user_role(current_user)
        if current_user.present? && current_user.admin? 
            return true
        else
            return false
        end
    end
end
