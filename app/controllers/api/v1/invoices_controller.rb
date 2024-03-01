class Api::V1::InvoicesController < ApiControllerBase
    before_action :set_invoice, only: [:show, :update, :destroy, :generate_pdf]

    def index
        @invoices = Invoice.paginate(page: params[:page], per_page: params[:per_page])
        authorize @invoices

        if @invoices.blank?
            render_error("Invoices not found", :not_found)
        else
            render_success(serialized_invoices(@invoices), :ok, total_invoices: Invoice.count)
        end

    rescue => e
        render_error("An error occurred: #{e.message}", :not_found)
    end

    def show
        authorize @invoice
        render_success(serialized_invoice(@invoice), :ok)
    end

    def create
        @invoice = Invoice.create_invoice(invoice_params)
        authorize @invoice

        Invoice.transaction do
            if @invoice.save && create_invoice_medicines && update_total_amount_of_invoice && update_medicines_inventory_quantity
                render_success(serialized_invoice(@invoice), :created)
            else
                render_error(@invoice.errors.full_messages.join(', '), :unprocessable_entity)
            end
        end

    rescue => e
        render_error("An error occurred: #{e.message}", :not_found)
    end

    def search
        if params[:q].present?
            if Api::Validators::ParametersValidator.validate_search_params?(params[:q])
                render_error("Invalid parameters.", :bad_request) 
            else
                search_query = "%#{params[:q]}%"
                @invoices = Invoice.where("id LIKE ? OR order_number LIKE ?", search_query, search_query)
                render_success(serialized_invoices(@invoices), :ok)
            end
        else
            render_error('Parameter "q" is required.', :bad_request)
        end
    end

    def filter
        start_date = params[:start_date]
        end_date   = params[:end_date].presence || Date.today.to_s

        validator = Api::Validators::ParametersValidator.new

        if validator.valid_date?(start_date) && validator.valid_date?(end_date)
            start_date = Date.parse(start_date)
            end_date   = Date.parse(end_date)

            if start_date <= end_date
                @invoices = Invoice.where(created_at: start_date.beginning_of_day..end_date.end_of_day)
                render_success(serialized_invoices(@invoices), :ok)
            else
                render_error('Start date cannot be after end date.', :bad_request)
            end
        else
            render_error('Invalid date format.', :bad_request)
        end

    rescue => e
        render_error("An error occurred: #{e.message}", :bad_request)
    end

    def generate_pdf
        pdf = Api::Pdfs::InvoicePdf.new(@invoice)
        send_data pdf.render, filename: "invoice.pdf", type: "application/pdf", disposition: "inline"
    end

    private

    def set_invoice
        if params[:id].present? && params[:id].to_i.positive?
            @invoice = Invoice.find(params[:id])
        else
            render_error("Invalid parameter: id", :unprocessable_entity)
        end

    rescue ActiveRecord::RecordNotFound
        render_error("Invoice not found.", :not_found) 
    end

    def create_invoice_medicines
        InvoicesMedicine.create_invoice_medicines(params[:invoice_medicines], @invoice)
    end

    def update_total_amount_of_invoice
        @invoice.update_total_amount(params[:invoice_medicines], @invoice)
    end

    def update_medicines_inventory_quantity
        @invoice.update_medicines_inventory_quantity(params[:invoice_medicines])
    end

    def serialized_invoices(invoices)
        InvoiceSerializer.new(invoices)
    end

    def serialized_invoice(invoice)
        InvoiceSerializer.new(invoice)
    end

    def invoice_params
        params.require(:invoice).permit(:order_number, :supplier_id, :user_id, :comments,
                                        invoice_medicines: [:medicine_id, :quantity, :discount, :price])
    end
end