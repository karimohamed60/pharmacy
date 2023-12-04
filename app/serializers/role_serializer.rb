class RoleSerializer
  include JSONAPI::Serializer
  
  attributes :id, :role_name

  has_many :users 
end
