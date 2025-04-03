class UsersController < ApplicationController
    before_action :set_user, only: %i[ show edit update destroy ]

    # GET /users or /users.json
    def index
      @users = User.all
    end

    # GET /users/1
    def show
      @user = User.find_by(id: params[:id])
      if @user.nil?
        redirect_to users_path, notice: "User not found"
      else
        render :show
      end
    end

    # GET /users/1/edit
    def edit
      @user = User.find(params[:id])
      @user.update(user_params)
      @user.save
    end

    # POST /users
    def create
      @user = User.new(user_params)

      respond_to do |format|
        if @user.save
          format.html { redirect_to @user, notice: "User was successfully created." }
          format.json { render :show, status: :created, location: @user }
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @user.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /users/1
    def update
      respond_to do |format|
        if @user.update(user_params)
          format.html { redirect_to @user, notice: "User was successfully updated." }
          format.json { render :show, status: :ok, location: @user }
        else
          format.html { render :edit, status: :unprocessable_entity }
          format.json { render json: @user.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /users/1
    def destroy
      @user.destroy!

      redirect_to users_path, status: 200, notice: "User was successfully deleted."

      # respond_to do |format|
      #   format.html { redirect_to users_path, status: :see_other, notice: "User was successfully destroyed." }
      #   format.json { head :no_content }
      # end
    end

    private
      # Only allow a list of trusted parameters through.
      def user_params
        params.expect(user: [ :name, :email, :phone, :hometown, :zipcode ])
      end
end
