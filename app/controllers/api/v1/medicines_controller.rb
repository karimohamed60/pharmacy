class Api::V1::MedicinesController < ApiControllerBase
    before_action :set_medicine, only: [:show, :update, :destroy]

    def index
        @medicines = Medicine.paginate(page: params[:page], per_page: params[:per_page])
        authorize @medicines

        if @medicines.blank?
            render_error("Medicines not found", :not_found)
        else
            render_success(serialized_medicines(@medicines), :ok, total_medicines: Medicine.count)
        end
    rescue ActiveRecord::RecordNotFound
        render_error("Medicines not found", :not_found)
    rescue => e
        render_error("An error occurred: #{e.message}", :not_found)
    end

    def show
        authorize @medicine
        render_success(serialized_medicine(@medicine), :ok)
    end

    def search
        if params[:q].present?
            if Api::Validators::ParametersValidator.validate_search_params?(params[:q])
                render_error("Invalid parameters.", :bad_request) 
            else
                search_query = "%#{params[:q]}%"
                @medicines = Medicine.where("ingredient_name LIKE ? OR commercial_name LIKE ?", search_query, search_query)
                render_success(serialized_medicines(@medicines), :ok, total_medicines: @medicines.count)
            end
        else
            render_error('Parameter "q" is required.', :bad_request)
        end
    end
    
    def create
        @medicine = Medicine.new(medicine_params)
        authorize @medicine
        
        if @medicine.save
            render_success(serialized_medicine(@medicine), :created)
        end
    rescue => e
        render_error("An error occurred: #{e.message}", :unprocessable_entity)
    end

    def update
        authorize @medicine

        if @medicine.update(medicine_params)
            render_success(serialized_medicine(@medicine), :ok)
        end
    rescue => e
        render_error("An error occurred: #{e.message}", :unprocessable_entity)
    end

    def destroy
        authorize @medicine

        if @medicine.destroy
            render_success({}, :no_content)
        else
            render_error("Failed to delete medicine.", :internal_server_error)
        end
    end


    private

    def set_medicine
        if params[:id].present? && params[:id].to_i.positive?
            @medicine = Medicine.find(params[:id])
        else
            render_error("Invalid parameter: id", :unprocessable_entity)
        end
    rescue ActiveRecord::RecordNotFound
        render_error("Medicine not found.", :not_found) 
    end

    def serialized_medicines(medicines)
        MedicineSerializer.new(medicines).serializable_hash
    end

    def serialized_medicine(medicine)
        MedicineSerializer.new(medicine)
    end

    def medicine_params
        params.require(:medicine).permit(:ingredient_name, :commercial_name, :international_barcode, :minor_unit, :medium_unit, :major_unit,
                                        :price_per_unit, :quantity_in_inventory, :quantity_in_pharmacy, :quantity_sold, :expire_date, :user_id, :category_id)
    end
end
