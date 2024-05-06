class ApplicationController < ActionController::Base
    skip_before_action :verify_authenticity_token

    private

    def authenticate_user!
        if current_user.nil?
            redirect_to new_user_session_path
            flash[:alert] = "You are not authorized to access this page"
        end
    end
end
