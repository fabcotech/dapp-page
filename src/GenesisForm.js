import React from 'react';

const defaultText = "Hi I'm Bob";
const defaultTitle = "Bob's page";

export class GenesisFormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text || defaultText,
      title: props.title || defaultTitle,
    };
  }

  render() {
    console.log(this.state);
    return (
      <div className="genesis-form form">
        <p>
          <h5 className="title is-5">Setup your personal page on Dappy</h5>
          {this.props.text
            ? `You must sign the transaction with the same private key you used initially. If not the page will not be updated. Once you have submitted this form, wait few
            minutes and reload the page to see the page.`
            : `We see that this page has just been deployed and there is no text
            associated with it. Once you have submitted this form, wait few
            minutes and reload the page to see the page.`}
          <br />
          <br />
        </p>
        <div className="field">
          <label className="label">Title (tab)</label>
          <div className="control">
            <input
              className="input"
              onChange={(e) => this.setState({ title: e.target.value })}
              type="text"
              defaultValue={this.props.title || defaultTitle}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Text (markdown)</label>
          <p className="note">
            <b>Note: </b>Data will be stored as a string, and secured with{' '}
            <b>encodeURI()</b>
          </p>
          <div className="control">
            <textarea
              className="textarea"
              rows="25"
              onInput={(e) => {
                this.setState({ text: e.target.value });
              }}
              defaultValue={this.props.text || defaultText}
            ></textarea>
          </div>
        </div>
        <br />
        <div className="field">
          <button
            className="button is-light"
            disabled={!(this.state && this.state.text && this.state.title)}
            type="button"
            onClick={(e) => {
              if (this.state && this.state.text && this.state.title) {
                this.props.onUpdatePage({
                  text: this.state.text,
                  title: this.state.title,
                });
              }
            }}
          >
            Save text and create page
          </button>{' '}
          {this.props.text ? (
            <button
              className="button is-light"
              type="button"
              onClick={this.props.cancel}
            >
              Cancel
            </button>
          ) : undefined}
        </div>
        <br />
      </div>
    );
  }
}
