class UserSerializer
  include JSONAPI::Serializer

  attributes :id, :username, :full_name, :role_name
  
  belongs_to :role, class_name: "Role"
  has_many :medicines, class_name: "Medicine"
  has_many :suppliers, class_name: "Supplier"
  has_many :invoices, class_name: "Invoice"
  has_many :orders, class_name: "Order"
  has_many :transfers, class_name: "Transfer"

  attribute :role_name do |object|
    object.role.role_name  
  end
end
