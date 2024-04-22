class Api::V1::SalafRequestsController < ApiControllerBase
    before_action :set_request, only: [:show, :update]

    def index
        @requests = SalafRequest.paginate(page: params[:page], per_page: params[:per_page])
        authorize @requests

        if @requests.blank?
            render_error("Requests are empty", :no_content)
        else
            render_success(serialized_requests(@requests), :ok, total_requests: SalafRequest.count)
        end

    rescue => e
        render_error("An error occurred: #{e.message}", :internal_server_error)
    end

    def show
        authorize @request
        render_success(serialized_request(@request), :ok)
    rescue => e
        render_error("An error occurred: #{e.message}", :internal_server_error)
    end

    def create
        @request = SalafRequest.new(request_params)
        authorize @request

        if @request.save
            render_success(serialized_request(@request), :created)
        else
            render_error("Failed to create a request", :unprocessable_entity)
        end

    rescue => e
        render_error("An error occurred: #{e.message}", :internal_server_error)
    end

    def update
        authorize @request

        if @request.update(request_params)
            render_success(serialized_request(@request), :ok)
        else
            render_error("Failed to update the request", :unprocessable_entity)
        end
    rescue => e
        render_error("An error occurred: #{e.message}", :unprocessable_entity)
    end

    def search
        if params[:q].present?
            if Api::Validators::ParametersValidator.validate_search_params?(params[:q])
                render_error("Invalid parameters.", :bad_request) 
            else
                search_query = "%#{params[:q]}%"
                @requests = SalafRequest.joins(:student).where("students.student_national_id LIKE ?", search_query)
                render_success(serialized_requests(@requests), :ok, total_requests: @requests.count)
            end
        else
            render_error('Parameter "q" is required.', :bad_request)
        end
    end

    private

    def set_request
        if params[:id].present? && params[:id].to_i.positive?
            @request = SalafRequest.find(params[:id])
        else
            render_error("Invalid parameter: id", :unprocessable_entity)
        end

    rescue ActiveRecord::RecordNotFound
        render_error("Request not found.", :not_found) 
    end

    def serialized_requests(requests)
        SalafRequestSerializer.new(requests)
    end

    def serialized_request(request)
        SalafRequestSerializer.new(request)
    end

    def request_params
        params.require(:request).permit(:student_id, :status).merge(medicine_name: JSON.generate(params.dig(:request, :medicine_name)))
    end
end