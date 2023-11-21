class Medicine < ApplicationRecord

    self.table_name = "medicines"

    belongs_to :user, class_name: "User"
    belongs_to :category, class_name: "Category"
    has_many :medicines_suppliers, class_name: "MedicinesSupplier"
    has_many :suppliers, through: :medicines_suppliers, class_name: "Supplier"
    has_many :orders_medicines, class_name: "OrdersMedicine"
    has_many :invoices_medicines, class_name: "InvoicesMedicine"
    has_many :transfers_medicines, class_name: "TransfersMedicine"
end
