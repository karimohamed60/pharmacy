class Supplier < ApplicationRecord

    self.table_name = "suppliers"

    belongs_to :user, class_name: "User"
    has_many :invoices, class_name: "Invoice"
    has_many :medicines_suppliers, class_name: "MedicinesSupplier"
    has_many :medicines, through: :medicines_suppliers, class_name: "Medicine"
end
