class ApiControllerBase < ApplicationController

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
end
