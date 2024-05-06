ActiveAdmin.register Supplier do
  permit_params :supplier_name, :description, :date, :user_id

  index do
    selectable_column
    id_column
    column :supplier_name
    column :description
    column :date
    actions
  end

  filter :supplier_name
  filter :description
  filter :date

  form do |f|
    f.inputs do
      f.input :supplier_name
      f.input :description
      f.input :user, as: :select, collection: User.all.collect { |user| [user.username, user.id] }
      f.input :date, as: :datepicker
    end
    f.actions
  end
end
