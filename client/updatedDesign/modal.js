
const modalHtml = () =>{
  return `<div class="modal fade" id="add-attr" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<form class="s-benchmark-input__form add-attr-form form">
						<div class="add-attr-form__header">
							<div class="row align-items-center">
								<div class="col-md-12 ">
									<div class="add-attr-form__heading">
										Additional Attributes
									</div>
								</div>
							</div>
						</div>
						<div class="add-attr-form__body">
							<div class="add-attr-form__group form__group">
								<div class="row">
									<div class="col-md-4 d-flex align-items-center">
										<label for="40yd" class="add-attr-form__group-label form__group-label">40 yd</label>
									</div>
									<div class="col-md-8 pr-md-4">
										<input type="text"  id="40yd" name="40yd" placeholder="e.g. Ryan" class="add-attr-form__group-input form__group-input">
									</div>
								</div>
							</div>
							
							<div class="add-attr-form__group form__group">
								<div class="row">
									<div class="col-md-4 d-flex align-items-center">
										<label for="rushingTouchdowns" class="add-attr-form__group-label form__group-label">Rushing Touchdowns</label>
									</div>
									<div class="col-md-8 pr-md-4">
										<input type="text"  id="rushingTouchdowns" name="rushingTouchdowns" placeholder="e.g. Ryan" class="add-attr-form__group-input form__group-input">
									</div>
								</div>
							</div>
							
							<div class="add-attr-form__submit-btn-block form__submit-btn-block">
								<input type="submit" class="add-attr-form__form-submit-btn form__submit-btn" value="Submit">
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>`
}


