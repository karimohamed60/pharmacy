class UserSerializer
  include JSONAPI::Serializer

  attributes :id, :username, :full_name, :role_name
  
  belongs_to :role, class_name: "Role"

  attribute :role_name do |object|
    object.role.role_name  
  end
end
