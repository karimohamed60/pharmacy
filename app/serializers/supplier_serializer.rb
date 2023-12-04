class SupplierSerializer
  include JSONAPI::Serializer

  attributes :id, :supplier_name, :description, :date, :created_at, :updated_at

  belongs_to :user
  has_many :invoices
  has_many :medicines
end
