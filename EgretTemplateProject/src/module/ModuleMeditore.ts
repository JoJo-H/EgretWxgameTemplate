

@core.mediator()
class ModuleMeditore extends core.Mediator implements core.IMediator{
    static NAME:string = 'ModuleMeditore';
    constructor()
    {
        super(ModuleMeditore.NAME);
    }

    listNotificationInterests():string[]
    {
        let arr = ["test_send","test_pos"];
        return arr.concat(super.listNotificationInterests());
    }

    handleNotification( notification:core.INotification ):void
    {
        switch(notification.getName()) {
            case "test_send":
                console.log("test_send：",...notification.getArr());
                break;
            case "test_pos":
                console.log("test_pos",...notification.getBody());
                break;
        }
    }

    @core.notice('openSome')
    openSome():void {
        console.log('openSome');
    }

    onRegister():void
    {

    }
    
    onRemove():void
    {

    }
}