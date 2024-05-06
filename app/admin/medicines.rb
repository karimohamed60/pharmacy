ActiveAdmin.register Medicine do
  permit_params :ingredient_name, :commercial_name, :international_barcode, :minor_unit, :medium_unit, :major_unit, :price_per_unit, :quantity_in_inventory, :quantity_in_pharmacy, :quantity_sold, :expire_date, :user_id, :category_id

  index do
    selectable_column
    id_column
    column :commercial_name
    column :ingredient_name
    column :price_per_unit
    column :quantity_in_inventory
    column :quantity_in_pharmacy
    column :quantity_sold
    column :expire_date
    actions
  end

  show do
    attributes_table do
      row :commercial_name
      row :ingredient_name
      row :international_barcode
      row :minor_unit
      row :medium_unit
      row :major_unit
      row :price_per_unit
      row :quantity_in_inventory
      row :quantity_in_pharmacy
      row :quantity_sold
      row :expire_date
      row :user do |resource|
        resource.user&.username
      end
      row :category do |resource|
        resource.category&.category_name
      end
      row :created_at
      row :updated_at
    end
  end

  filter :commercial_name
  filter :ingredient_name
  filter :category, as: :select, collection: -> { Category.pluck(:category_name, :id) }
  filter :expire_date

  form do |f|
    f.inputs do
      f.input :commercial_name
      f.input :ingredient_name
      f.input :international_barcode, as: :number
      f.input :minor_unit
      f.input :medium_unit
      f.input :major_unit
      f.input :price_per_unit
      f.input :quantity_in_inventory
      f.input :quantity_in_pharmacy
      f.input :expire_date, as: :datepicker
      f.input :user, as: :select, collection: User.all.collect { |user| [user.username, user.id] }
      f.input :category, as: :select, collection: Category.all.collect { |category| [category.category_name, category.id] }
    end
    f.actions
  end
end
