interface IProps {
    children: JSX.Element | JSX.Element[] | null;
}

export function PopupHeader (props: IProps) {
    const { children } = props;
    
    return (
        <header>
            <div className="column">
                <div className="logo">
                    <img src="icons/128x128.png" width="26" alt="" />
                </div>

                <div className="title-wrapper">
                    <h3 className="title">Super CSS Inject</h3>
                    {children}
                </div>
            </div>
        </header>
    );
}
