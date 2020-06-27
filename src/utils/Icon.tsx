import React, { Component } from "react";
import { getSize } from "./size";

interface IconProps {
    icon: any;
    size?: string;
    title: string;
    className?: string;
}

export class Icon extends Component<IconProps, {}> {
    render() {
        const cn = 'flex items-center ' + (this.props.className ? this.props.className : '');
        const sizeProp = this.props.size ? this.props.size : 'md';
        const size = getSize(sizeProp);
        return (
            <div className={cn}>
                <div className={'flex align-center justify-center ' + size[0] + ' ' + size[1]}>
                    <img src={this.props.icon} title={this.props.title} className={'w-full h-full object-contain'}/>
                </div>
            </div>
        );
    }
}
