module Api
  module Pdfs
    class InvoicePdf < Prawn::Document
      def initialize(invoice)
        super()
        @invoice = invoice
        generate_pdf
      end

      def generate_pdf
        # Set font
        font "Helvetica"

        # Title
        text "INVOICE", align: :center, size: 36, style: :bold, color: "336699"
        move_down 20

        # Invoice details
        invoice_details = [
          [{ content: "Invoice ID:", font_style: :bold }, @invoice.id],
          [{ content: "Order Number:", font_style: :bold }, @invoice.order_number],
          [{ content: "Date:", font_style: :bold }, l(@invoice.created_at)],
          [{ content: "Supplier:", font_style: :bold }, @invoice.supplier.supplier_name]
        ]
        table(invoice_details, cell_style: { padding: [5, 10], size: 12 }, width: bounds.width, column_widths: [150, bounds.width - 150]) do
          cells.borders = []
        end
        move_down 20

        # Medicines table
        medicines_data = [["Medicine ID", "Quantity", "Discount", "Price", "Amount"]]
        @invoice.invoices_medicines.each do |invoice_medicine|
          medicines_data << [
            invoice_medicine.medicine_id,
            invoice_medicine.quantity,
            invoice_medicine.discount,
            price(invoice_medicine.price),
            price(invoice_medicine.amount)
          ]
        end
        table medicines_data, header: true, cell_style: { padding: [5, 10], size: 12 }, width: bounds.width do
          row(0).font_style = :bold
          columns(3..4).align = :right
          cells.borders = [:bottom]
        end
        move_down 20

        # Total amount
        text "Total: #{price(@invoice.total_amount)}", align: :right, size: 16, style: :bold
        move_down 20

        # Comments
        text "Notes:", size: 14, style: :bold
        text @invoice.comments, size: 12

        # Footer
        number_pages "Page <page> of <total>", at: [bounds.right - 150, 0], align: :center, size: 10
      end

      def l(date)
        date.strftime("%d-%m-%Y")
      end

      def price(amount)
        sprintf("%.2f", amount)
      end
    end
  end
end
