///<reference path="mvc/Mediator.ts" />
module core {

	export class CoreMediator extends core.Mediator implements core.IMediator {
		static NAME: string = 'CoreMediator';
		constructor() {
			super(CoreMediator.NAME);
		}

		onRegister(): void {

		}

		onRemove(): void {

		}

		listNotificationInterests(): string[] {
			let arr = [];
			return arr.concat(super.listNotificationInterests());
		}

		handleNotification(notification: core.INotification): void {
			switch (notification.getName()) {

			}
		}


	}
}