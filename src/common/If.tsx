interface IProps {
    children: JSX.Element | JSX.Element[] | string;
    condition: boolean;
}

function If (props: IProps) {
    const { children, condition } = props;

    if (condition) {
        return <>{children}</>;
    }

    return null;
}

export default If;
