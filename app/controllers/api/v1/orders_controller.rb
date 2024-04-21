class Api::V1::OrdersController < ApiControllerBase
    before_action :set_order, only: [:show, :generate_pdf]

    def index
        @orders = Order.paginate(page: params[:page], per_page: params[:per_page])
        authorize @orders

        if @orders.blank?
            render_error("Orders are empty", :no_content)
        else
            render_success(serialized_orders(@orders), :ok, total_orders: Order.count)
        end

    rescue => e
        render_error("An error occurred: #{e.message}", :not_found)
    end

    def show
        authorize @order
        render_success(serialized_order(@order), :ok)
    rescue => e
        render_error("An error occurred: #{e.message}", :internal_server_error)
    end

    def create
        @order = Order.new(order_params)
        authorize @order

        Order.transaction do
            if valid_order?
                render_success(serialized_order(@order), :created)
            else
                render_error("Failed to create an order", :unprocessable_entity)
                raise ActiveRecord::Rollback
            end
        end

    rescue => e
        render_error("An error occurred: #{e.message}", :internal_server_error)
    end

    def search
        if params[:q].present?
            if Api::Validators::ParametersValidator.validate_search_params?(params[:q])
                render_error("Invalid parameters.", :bad_request) 
            else
                search_query = "%#{params[:q]}%"
                @orders = Order.joins(:student).where("students.student_national_id LIKE ?", search_query)
                render_success(serialized_orders(@orders), :ok, total_orders: @orders.count)
            end
        else
            render_error('Parameter "q" is required.', :bad_request)
        end
    end

    def generate_pdf
        pdf = Api::Pdfs::OrderPdf.new(@order)
        send_data pdf.render, filename: "order_#{@order.id}.pdf", type: "application/pdf", disposition: "inline"
    end

    private

    def set_order
        if params[:id].present? && params[:id].to_i.positive?
            @order = Order.find(params[:id])
        else
            render_error("Invalid parameter: id", :unprocessable_entity)
        end

    rescue ActiveRecord::RecordNotFound
        render_error("Order not found.", :not_found) 
    end

    def valid_order?
        @order.save && @order.order_medicines.present? && check_pharmacy_quantity && update_medicine_sold_quantity && update_medicine_pharmacy_quantity
    end

    def check_pharmacy_quantity
        @order.check_pharmacy_quantity(params[:order_medicines_attributes])
    end

    def update_medicine_sold_quantity
        @order.update_medicine_sold_quantity(params[:order_medicines_attributes])
    end

    def update_medicine_pharmacy_quantity
        @order.update_medicine_pharmacy_quantity(params[:order_medicines_attributes])
    end

    def serialized_orders(orders)
        OrderSerializer.new(orders)
    end

    def serialized_order(order)
        OrderSerializer.new(order)
    end

    def order_params
        params.require(:order).permit(:student_id, :user_id, order_medicines_attributes: [:medicine_id, :quantity])
    end
end