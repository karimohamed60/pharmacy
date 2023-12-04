class InvoiceSerializer
  include JSONAPI::Serializer

  attributes :id, :order_number, :comments, :total_amount, :created_at, :updated_at

  belongs_to :user
  belongs_to :supplier
  has_many :invoices_medicines
end
