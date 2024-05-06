class Api::V1::TransfersController < ApiControllerBase
    before_action :set_transfer, only: [:show, :update]

    def index
        @transfers = Transfer.paginate(page: params[:page], per_page: params[:per_page])
        authorize @transfers

        if @transfers.blank?
            render_error("Transfers not found", :not_found)
        else
            render_success(serialized_transfers(@transfers), :ok, total_transfers: Transfer.count)
        end

    rescue => e
        render_error("An error occurred: #{e.message}", :not_found)
    end

    def show
        authorize @transfer
        render_success(serialized_transfer(@transfer), :ok)
    end

    def create
        @transfer = Transfer.new(transfer_params)
        authorize @transfer

        Transfer.transaction do
            if @transfer.save && create_transfer_medicines
                render_success(serialized_transfer(@transfer), :created)
            else
                render_error("Failed to create a transfer.", :unprocessable_entity)
                raise ActiveRecord::Rollback
            end
        end

    rescue => e
        render_error("An error occurred: #{e.message}", :internal_server_error)
    end

    def update
        authorize @transfer

        if @transfer.update(transfer_params) && update_transfer_medicines
            render_success(serialized_transfer(@transfer), :ok)
        else
            render_error("Failed to update a transfer", :unprocessable_entity)
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
                @transfers = Transfer.where("id LIKE ?", search_query)
                render_success(serialized_transfers(@transfers), :ok, total_transfers: @transfers.count)
            end
        else
            render_error('Parameter "q" is required.', :bad_request)
        end
    end

    def filter
        status = params[:status]

        if status.present?
            if Api::Validators::ParametersValidator.validate_search_params?(status)
                render_error('Invalid parameter.', :bad_request)
            else
                filter_query = case status.downcase
                when 'pending'
                    0
                when 'accepted'
                    1
                when 'rejected'
                    2
                else
                    render_error('Invalid status parameter.', :bad_request)
                    return
                end

                @transfers = Transfer.where(status: filter_query)

                render_success(serialized_transfers(@transfers), :ok)
            end
        else
            render_error('Parameter "status" is required.', :bad_request)
        end
    end

    private

    def set_transfer
        if params[:id].present? && params[:id].to_i.positive?
            @transfer = Transfer.find(params[:id])
        else
            render_error("Invalid parameter: id", :unprocessable_entity)
        end
    rescue ActiveRecord::RecordNotFound
        render_error("Transfer not found.", :not_found)
    end

    def create_transfer_medicines
        TransfersMedicine.create_transfer_medicines(params[:transfer_medicines], @transfer)
    end

    def update_transfer_medicines
        TransfersMedicine.update_transfer_medicines(params[:transfer_medicines], @transfer)
    end

    def serialized_transfers(transfers)
        TransferSerializer.new(transfers)
    end

    def serialized_transfer(transfer)
        TransferSerializer.new(transfer)
    end

    def transfer_params
        params.require(:transfer).permit(:user_id, :status, transfer_medicines: [:medicine_id, :quantity, :destroy])
    end
end
