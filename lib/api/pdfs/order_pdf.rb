module Api
    module Pdfs
        class OrderPdf < Prawn::Document
        def initialize(order)
            super()
            @order = order
            generate_pdf
        end

        def generate_pdf
            # Set font
            font "Helvetica"

            # Title
            text "ORDER", align: :center, size: 36, style: :bold, color: "336699"
            move_down 20

            # Order details
            order_details = [
            [{ content: "Order ID:", font_style: :bold }, @order.id],
            [{ content: "Student National ID:", font_style: :bold }, @order.student.student_national_id],
            [{ content: "User:", font_style: :bold }, @order.user.username],
            [{ content: "Date:", font_style: :bold }, l(@order.created_at)],
            ]
            table(order_details, cell_style: { padding: [5, 10], size: 12 }, width: bounds.width, column_widths: [150, bounds.width - 150]) do
            cells.borders = []
            end
            move_down 40

            # Medicines table
            medicines_data = [["Medicine Name",  "Quantity"]]
            @order.order_medicines.each do |order_medicine|
            medicines_data << [
                order_medicine.medicine.commercial_name,
                order_medicine.quantity
            ]
            end
            table medicines_data, header: true, cell_style: { padding: [5, 10], size: 12 }, width: bounds.width do
            row(0).font_style = :bold
            cells.borders = [:bottom]
            end
            move_down 20

            # Footer
            number_pages "Page <page> of <total>", at: [bounds.right - 150, 0], align: :center, size: 10
        end

        def l(date)
            date.strftime("%d-%m-%Y")
        end
        end
    end
end
