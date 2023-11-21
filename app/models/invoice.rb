class Invoice < ApplicationRecord

    self.table_name = "invoices"

    belongs_to :user, class_name: "User"
    belongs_to :supplier, class_name: "Supplier"
    has_many :invoices_medicines, class_name: "InvoicesMedicine"
end
