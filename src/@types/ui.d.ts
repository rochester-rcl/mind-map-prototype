interface ITextareaProps extends IUIProps {
    onChange?: (value: string) => any;
    onSelect?: (value: any) => any;
    value?: FlattenSimpleInterpolation;
}
