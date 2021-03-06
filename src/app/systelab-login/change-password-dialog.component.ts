import { AfterViewInit, Component } from '@angular/core';
import { DialogRef, ModalComponent } from 'ngx-modialog';
import { I18nService } from 'systelab-translate/lib/i18n.service';
import { Observable } from 'rxjs/Observable';
import { DialogService, MessagePopupService, SystelabModalContext } from 'systelab-components/widgets/modal';
import { PasswordUtil } from './password.util';

export class ChangePasswordDialogParameters extends SystelabModalContext {
	public width = 550;
	public height = 330;
	public userName: string;
	public minPasswordStrengthValue = 1;
	public action: (oldPassword: string, newPassword: string) => Observable<boolean>;
}

@Component({
	templateUrl: 'change-password-dialog.component.html',
	styleUrls:   ['change-password-dialog.component.scss'],
})
export class ChangePasswordDialog implements ModalComponent<ChangePasswordDialogParameters>, AfterViewInit {

	public parameters: ChangePasswordDialogParameters;

	public isLoading = false;

	public newPassword: string;
	public repeatedPassword: string;
	public oldPassword: string;

	public minPasswordLength: number;

	public static getParameters(): ChangePasswordDialogParameters {
		return new ChangePasswordDialogParameters();
	}

	constructor(public dialog: DialogRef<ChangePasswordDialogParameters>, protected dialogService: DialogService, protected messagePopupService: MessagePopupService, protected i18nService: I18nService) {
		this.parameters = dialog.context;
	}

	public ngAfterViewInit() {
		setTimeout(() => {
			document.getElementById('form-h-it')
				.focus();
			this.oldPassword = '';
		}, 500);
	}

	public close(): void {
		this.dialog.close();
	}

	public isOK() {
		return this.oldPassword &&
			this.newPassword === this.repeatedPassword &&
			PasswordUtil.evaluatePasswordStrength(this.newPassword) >= this.parameters.minPasswordStrengthValue;
	}

	public changePassword(): void {
		this.parameters.action(this.oldPassword, this.newPassword)
			.subscribe(
				(response) => {
					if (response) {
						this.close();
					}
				}
			);
	}

	public getPasswordComplexityTooltip() {
		return PasswordUtil.getPasswordComplexityTooltip(this.parameters.minPasswordStrengthValue, this.i18nService);
	}

	public getPasswordComplexityStyle() {
		return PasswordUtil.getStyle(PasswordUtil.evaluatePasswordStrength(this.newPassword));
	}

	public getPasswordComplexityAsLabel() {
		const key = PasswordUtil.getTranslationKey(PasswordUtil.evaluatePasswordStrength(this.newPassword));
		if (key) {
			return this.i18nService.instant(key);
		} else {
			return '';
		}
	}

	public checkNewRepeatedPassword(): boolean {
		return this.newPassword !== this.repeatedPassword;
	}
}
