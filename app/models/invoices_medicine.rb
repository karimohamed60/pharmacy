class InvoicesMedicine < ApplicationRecord
    self.table_name = "invoices_medicines"

    belongs_to :invoice, class_name: "Invoice"
    belongs_to :medicine, class_name: "Medicine"
end
