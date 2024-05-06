ActiveAdmin.register Student do
  permit_params :student_national_id, :student_name

  index do
    selectable_column
    id_column
    column :student_national_id
    column :student_name
    actions
  end

  show do
    attributes_table do
      row :student_national_id
      row :student_name
    end
  end

  filter :student_national_id
  filter :student_name

  form do |f|
    f.inputs "Student Details" do
      f.input :student_national_id
      f.input :student_name
    end
    f.actions
  end
end
