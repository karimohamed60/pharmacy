module Api
  module Pdfs
    class PrescriptionPdf < Prawn::Document
      def initialize(prescription)
        super()
        @prescription = prescription
        generate_pdf
      end

      def generate_pdf
        # Set font
        font "Helvetica"

        # Title
        text "PRESCRIPTION", align: :center, size: 36, style: :bold, color: "336699"
        move_down 50

        # Prescription details
        prescription_details = [
          [{ content: "Prescription ID:", font_style: :bold }, @prescription.first.id],
          [{ content: "Date:", font_style: :bold }, l(@prescription.first.date)],
          [{ content: "Status:", font_style: :bold },
            if @prescription.first.status == 0
                "Pending"
            elsif @prescription.first.status == 1
                "Delivered"
            else
                "Finished"
            end
        ]
        ]
        table(prescription_details, cell_style: { padding: [5, 10], size: 12 }, width: bounds.width, column_widths: [150, bounds.width - 150]) do
          cells.borders = []
        end
        move_down 30

        # Medicines table
        medicines_data = [["Medicine Name", "Dosage", "Quantity", "Got Medicine"]]
        @prescription.first.prescriptions_medicines.each do |prescription_medicine|
          medicines_data << [
            prescription_medicine.medicine_name,
            prescription_medicine.dosage,
            prescription_medicine.quantity,
            prescription_medicine.got_medicine == 1 ? "Yes" : "No"
          ]
        end
        table medicines_data, header: true, cell_style: { padding: [5, 10], size: 12 }, width: bounds.width do
          row(0).font_style = :bold
          columns(2..3).align = :right
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
