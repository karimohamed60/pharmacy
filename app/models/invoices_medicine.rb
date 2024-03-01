class InvoicesMedicine < ApplicationRecord
    self.table_name = "invoices_medicines"

    belongs_to :invoice, class_name: "Invoice"
    belongs_to :medicine, class_name: "Medicine"


    def self.create_invoice_medicines(medicines_params, invoice)
        return unless medicines_params.present?

        calculate_medicine_amount(medicines_params)

        medicines_params.each do |medicine|
            invoice.invoices_medicines.create(medicine.permit(:medicine_id, :quantity, :discount, :price, :amount))
        end
    end

    def self.calculate_medicine_amount(medicines_params)
        return unless medicines_params.present?

        medicines_params.each do |medicine|
            Api::Calculations::InvoiceCalculations.calculate_medicine_amount(medicine)
        end

        return medicines_params
    end
end
