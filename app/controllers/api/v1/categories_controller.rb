class Api::V1::CategoriesController < ApiControllerBase
    before_action :set_category, only: [:show, :update, :destroy]

    def index
        @categories = Category.all
        authorize @categories

        render_success(serialized_categories(@categories), :ok)

    rescue => e
        render_error("An error occurred: #{e.message}", :bad_request)
    end

    def show
        authorize @category
        render_success(serialized_category(@category), :ok)
    end

    def create
        @category = Category.new(category_params)
        authorize @category

        if @category.save
            render_success(serialized_category(@category), :created)
        end
    rescue => e
        render_error("An error occurred: #{e.message}", :unprocessable_entity)
    end

    def update
        authorize @category
        if @category.update(category_params)
            render_success(serialized_category(@category), :ok)
        end
    rescue => e
        render_error("An error occurred: #{e.message}", :unprocessable_entity)
    end

    def destroy
        authorize @category

        if @category.destroy
            render_success({}, :no_content)
        else
            render_error("Failed to delete category.", :internal_server_error)
        end
    end

    private

    def set_category
        if params[:id].present? && params[:id].to_i.positive?
            @category = Category.find params[:id]
        else
            render_error("Invalid parameter: id", :unprocessable_entity)
        end
    rescue ActiveRecord::RecordNotFound
        render_error("Category not found.", :not_found)
    end

    def serialized_categories(categories)
        CategorySerializer.new(categories)
    end

    def serialized_category(category)
        CategorySerializer.new(category)
    end

    def category_params
        params.require(:category).permit(:category_name)
    end
end
