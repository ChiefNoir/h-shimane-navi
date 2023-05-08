class LikesController < ApplicationController
  def create
    @like = current_user.likes.new(like_params)
    if !@like.save
      flash[:notice] = @like.errors.full_messages.to_sentence
    end
    redirect_to request.fullpath
  end

  def destroy
    @like = current_user.likes.find(params[:id])
    tour = @like.tour
    @like.destroy
    redirect_to request.fullpath
  end

  private

  def like_params
    params.require(:like).permit(:tour_id)
  end
end