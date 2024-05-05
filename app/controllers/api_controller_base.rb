class ApiControllerBase < ActionController::API
    before_action :configure_permitted_parameters, if: :devise_controller?
    before_action :authenticate_user!

    include Pundit::Authorization

    rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

    def render_success(data, status, additional_data = {})
        success_response = {
            status: "success",
            code: 200,
            **data
        }

        success_response.merge!(additional_data) if additional_data.present?

        render json: success_response, status: status
    end

    def render_error(error, status)
        error_response = {
            status: "error",
            error: error
        }
        render json: error_response, status: status
    end

    protected

    def user_not_authorized
        render json: { error: "You are not authorized to perform this action." }, status: :forbidden
    end

    def configure_permitted_parameters
        devise_parameter_sanitizer.permit(:sign_up, keys: [:username, :full_name, :role_id])
    end
end
