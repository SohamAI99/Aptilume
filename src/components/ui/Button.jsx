import React from 'react';
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-input hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                success: "bg-success text-success-foreground hover:bg-success/90",
                warning: "bg-warning text-warning-foreground hover:bg-warning/90",
                danger: "bg-error text-error-foreground hover:bg-error/90",
                soft: "bg-muted/60 text-foreground hover:bg-muted border border-border",
                elevated: "bg-card text-card-foreground shadow-elevation-2 hover:shadow-elevation-3",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const Button = React.forwardRef(({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    icon,
    iconPosition = 'left',
    children,
    ...props 
}, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
        <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
        >
            {icon && iconPosition === 'left' && (
                <span className="mr-2 flex items-center">
                    {icon}
                </span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
                <span className="ml-2 flex items-center">
                    {icon}
                </span>
            )}
        </Comp>
    );
});

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;