import React, { Component, ReactNode } from "react";
import Modal from 'react-modal';
import { SelectionPanel } from "./SelectionPanel";
import { customModalStyles } from "../view";

interface SelectionButtonProps<T> {
    available: T[];
    selectCount: number;
    buttonLabel: string;
    selectedLabel: string;
    rows: number;
    columns: number;
    renderFn: (item: T, index: number) => ReactNode;
    doneCb: (items: T[]) => void;
}

interface SelectionButtonState {
    show: boolean;
    selected: boolean;
}

export class SelectionButton<T> extends Component<SelectionButtonProps<T>, SelectionButtonState> {
    state = {
        show: false,
        selected: false
    };

    render() {
        return (
            <div>
                {this.state.selected ? <div className={'my-1'}>{this.props.selectedLabel}</div> :
                    <button className={'btn btn-std my-1'}
                            type="button" onClick={this.showModal}>{this.props.buttonLabel}</button>}
                {this.renderModal()}
            </div>
        );
    }

    private showModal = () => {
        this.setState({show: true});
    };

    private handleDone(items: T[]) {
        this.props.doneCb(items);
        this.setState({
            show: false,
            selected: true
        });
    }

    private handleCancel() {
        this.setState({
            show: false
        });
    }

    private renderModal() {
        return (
            <Modal isOpen={this.state.show} style={customModalStyles}>
                <SelectionPanel available={this.props.available}
                                rows={this.props.rows}
                                columns={this.props.columns}
                                renderFn={this.props.renderFn}
                                selectCount={this.props.selectCount}
                                doneCb={(selected: T[]) => this.handleDone(selected)}
                                cancelCb={() => this.handleCancel()}/>
            </Modal>
        );
    }
}
