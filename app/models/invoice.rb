class Invoice < ApplicationRecord

    self.table_name = "invoices"

    belongs_to :user, class_name: "User"
    belongs_to :supplier, class_name: "Supplier"
    has_many :invoices_medicines, class_name: "InvoicesMedicine", dependent: :destroy


    def self.create_invoice(invoice_params)
        invoice = Invoice.new(invoice_params.except(:invoice_medicines))
        invoice
    end

    def update_total_amount(invoice_medicines, invoice)
        total_amount = Api::Calculations::InvoiceCalculations.calculate_total_amount(invoice_medicines)
        invoice[:total_amount] = total_amount
    end
end
