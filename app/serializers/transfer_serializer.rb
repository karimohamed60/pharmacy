class TransferSerializer
  include JSONAPI::Serializer

  attributes :id, :status, :created_at, :updated_at

  belongs_to :user
  has_many :transfers_medicines
end