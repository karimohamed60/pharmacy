class OrderSerializer
  include JSONAPI::Serializer

  attributes :id, :created_at, :updated_at

  belongs_to :student
  belongs_to :user
  has_many :orders_medicines
end
