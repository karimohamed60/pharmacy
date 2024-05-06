ActiveAdmin.register SalafRequest do
  permit_params :student_id, :medicine_name, :status

  controller do
    before_action :student_exists?, only: [:create, :update]

    def student_exists?
      student = Student.find_by(id: params[:salaf_request][:student_id])
      unless student
        flash[:error] = "Student with ID #{params[:salaf_request][:student_id]} does not exist"
        redirect_to new_admin_salaf_request_url
      end
    end
  end

  index do
    selectable_column
    id_column
    column :student
    column :medicine_name
    column :status
    actions
  end

  filter :student_id
  filter :medicine_name
  filter :status, as: :select, collection: SalafRequest.statuses do |salaf_request|
    salaf_request.status
  end

  form do |f|
    f.inputs do
      f.input :student_id
      f.input :medicine_name
      f.input :status
    end
    f.actions
  end

  show do
    attributes_table do
      row :student
      row :medicine_name
      row :status
    end
  end
end
