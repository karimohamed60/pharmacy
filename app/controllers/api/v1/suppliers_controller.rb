class Api::V1::SuppliersController < ApiControllerBase
    before_action :set_supplier, only: [:show, :update, :destroy]

    def index
        @suppliers = Supplier.paginate(page: params[:page], per_page: params[:per_page])
        authorize @suppliers

        render_success(serialized_suppliers(@suppliers), :ok, total_suppliers: Supplier.count)
    rescue => e
        render_error("An error occurred: #{e.message}", :bad_request)
    end

    def show
        authorize @supplier
        render_success(serialized_supplier(@supplier), :ok)
    end

    def search
        if params[:q].present?
            if Api::Validators::ParametersValidator.validate_search_params?(params[:q])
                render_error("Invalid parameters.", :bad_request) 
            else
                search_query = "%#{params[:q]}%"
                @suppliers = Supplier.where("supplier_name LIKE ?", search_query)
                render_success(serialized_suppliers(@suppliers), :ok, total_suppliers: @suppliers.count)
            end
        else
            render_error('Parameter "q" is required.', :bad_request)
        end
    end

    def create
        @supplier = Supplier.new(supplier_params)
        authorize @supplier

        if @supplier.save
            render_success(serialized_supplier(@supplier), :created)
        end
    rescue => e
        render_error("An error occurred: #{e.message}", :unprocessable_entity)
    end

    def update
        authorize @supplier
        if @supplier.update(supplier_params)
            render_success(serialized_supplier(@supplier), :ok)
        end
    rescue => e
        render_error("An error occurred: #{e.message}", :unprocessable_entity)
    end

    def destroy
        authorize @supplier

        if @supplier.destroy
            render_success({}, :no_content)
        else
            render_error("Failed to delete category.", :internal_server_error)
        end
    end

    private

    def set_supplier
        if params[:id].present? && params[:id].to_i.positive?
            @supplier = Supplier.find params[:id]
        else
            render_error("Invalid parameter: id", :unprocessable_entity)
        end
    rescue ActiveRecord::RecordNotFound
        render_error("Supplier not found.", :not_found)
    end

    def serialized_suppliers(suppliers)
        SupplierSerializer.new(suppliers)
    end

    def serialized_supplier(supplier)
        SupplierSerializer.new(supplier)
    end

    def supplier_params
        params.require(:supplier).permit(:supplier_name, :description, :user_id, :date)
    end
end
