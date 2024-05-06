ActiveAdmin.register User do
  permit_params :username, :full_name, :role_id, :password, :password_confirmation, :active

  index do
    selectable_column
    id_column
    column :username
    column :full_name
    column :role_name
    column :current_sign_in_at
    column :last_sign_in_at
    column :created_at
    actions
  end

  show do
    attributes_table do
      row :username
      row :full_name
      row :role_name
      row :active
      row :current_sign_in_at
      row :last_sign_in_at
      row :created_at
    end
  end

  filter :username
  filter :role, as: :select, collection: Role.all.collect { |role| [role.role_name, role.id] }
  filter :current_sign_in_at

  form do |f|
    f.inputs do
      f.input :username
      f.input :full_name
      f.input :role, as: :select, collection: Role.all.collect { |role| [role.role_name, role.id] }
      f.input :password
      f.input :password_confirmation
      f.input :active
    end
    f.actions
  end
end
