import React from 'react';

const defaultText = "#### Hi i'm Bob \nI like football";
const defaultTitle = "Hi I'm Bob";

export class GenesisFormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      purseId: 'index',
      text: props.text || defaultText,
      title: props.title || defaultTitle,
    };
  }

  render() {
    const newPage = !!this.props.onCreatePage;
    return (
      <div className="genesis-form form">
        {
          newPage &&
          <p>
            <br />
            <h5 className="title is-5">Create your personal page on dappy</h5>
            {`You must have already deployed a NFT contract to create pages within it. The transaction
              will create a NFT token. You must sign the transaction with the same private key and box linked
              to the NFT contract. Once you have submitted this form, wait few
              minutes and reload the page to see the page.`}
            <br />
            <br />
          </p>
        }
        {
          !newPage &&
          <p>
            <br />
            <h5 className="title is-5">Update your personal page on dappy</h5>
            {`You must sign the transaction with the same private key and box linked to the NFT contract. Once you have submitted this form, wait few
              minutes and reload the page to see the page.`}
            <br />
            <br />
          </p>
        }
        { newPage && <div className="field">
          <label className="label">Contract ID</label>
          <div className="control">
            <input
              className="input"
              onChange={(e) => this.setState({ contractId: e.target.value })}
              type="text"
              defaultValue={''}
            />
          </div>
        </div> }
        { newPage && <div className="field">
          <label className="label">Page ID</label>
          <div className="control">
            <input
              className="input"
              onChange={(e) => this.setState({ purseId: e.target.value })}
              type="text"
              defaultValue={'index'}
            />
          </div>
        </div> }
        {
          newPage && this.state.contractId && this.state.purseId &&
          <p><u>{`page?contract=${this.state.contractId}${this.state.purseId === 'index' ? '' : `&page=${this.state.purseId}`}`}</u></p>
        }
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
          {
            newPage && 
            <button
              className="button is-light is-medium"
              disabled={!(this.state && this.state.text && this.state.title && this.state.contractId && this.state.purseId)}
              type="button"
              onClick={(e) => {
                this.props.onCreatePage({
                  text: this.state.text,
                  title: this.state.title,
                  contractId: this.state.contractId,
                  purseId: this.state.purseId,
                });
              }}
            >
              Save text and create page
            </button>
          }
          {
            !newPage && 
            <button
              className="button is-light is-medium"
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
              Save text and update page
            </button>
          }
          <button
            className="button is-light is-medium"
            type="button"
            onClick={this.props.cancel}
          >
            Cancel
          </button>
        </div>
        <br />
      </div>
    );
  }
}
