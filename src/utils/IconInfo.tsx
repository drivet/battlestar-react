import React, { Component } from "react";
import { getSize } from "./size";

interface IconInfoProps {
    icon: any;
    size?: string;
    text: string | number;
    title: string;
    className?: string;
}

export class IconInfo extends Component<IconInfoProps, {}> {
    render() {
        const sizeProp = this.props.size ? this.props.size : 'md';
        const size = getSize(sizeProp);
        const cn = 'flex items-center ' + (this.props.className ? this.props.className : '');
        return (
            <div className={cn}>
                <div className={'flex align-center justify-center ' + size[0] + ' ' + size[1]}>
                    <img src={this.props.icon} title={this.props.title} className={'w-full h-full object-contain'}/>
                </div>
                <div>{this.props.text}</div>
            </div>
        );
    }
}
