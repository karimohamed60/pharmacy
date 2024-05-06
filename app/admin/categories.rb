ActiveAdmin.register Category do
  permit_params :category_name

  filter :category_name
end
