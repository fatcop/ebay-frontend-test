import React from 'react';
import Widget from './Widget';
import { generateSlug, setRoutePath, getRoutePath, checkStatus, parseJSON, assetUrl } from '../helpers';
import '../styles/app.scss';

const navigationDelay = 150;

const Error = (props) => {
  return (
    <div className="error">{ props.text }</div>
  )
};

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      // TODO: Using global var. Also for server side rendering CONFIG not available, so hardcode.
      serverRendering: typeof CONFIG === 'undefined' || typeof CONFIG.serverRendering === 'undefined' || CONFIG.serverRendering,
      loading: false,
      navigating: false,
      data: null,
      currentIdx: 0,
      error: null
    }
  }

  loadContent() {

    this.setState({ data: null, loading: true });

    fetch(assetUrl('content.json'))
      .then(checkStatus)
      .then(response => response.json())
      .then(json => {

        // Get current location hash to lookup to find matching content
        const slug = getRoutePath(this.state.serverRendering);
        let currentIdx = -1;

        // Inject title slug into content items and record one matching current location hash (if any)
        // NOTE: Chose to inject rather than pure immutable approach.

        json.content.forEach((it, idx) => {
          it.slug = generateSlug(it.title);
          if (currentIdx === -1 && (!slug || it.slug === slug)) {
            currentIdx = idx;
          }
        });

        currentIdx = currentIdx >= 0 ? currentIdx : 0;
        this.setState({ data: json, loading: false, currentIdx });

        // If no slug, set location hash (ie. redirect root to first content item slug)
        if (!slug && !this.state.serverRendering) {
          setRoutePath(json.content[currentIdx].slug, this.state.serverRendering);
        }
      })
      .catch(error => {
        this.setState({ data: null, loading: false, error: `Failed to load content -  ${error}` });
      })
  }

  
  componentWillMount() {
    // For server side rendering, pass in content data directly on server
    if (this.props.data) {
      this.setState({ data: this.props.data, loading: false, currentIdx: this.props.currentIdx || 0 });
    }
  }
  
  componentDidMount () {
    this.loadContent();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps)  {}
  }
  
  navPrev(ev) {
    ev.preventDefault();
    if (this.state.currentIdx > 0) {
      const newIdx = this.state.currentIdx - 1;
      this.setState({ navigating: true });
      // Delay before setting navigation finished 
      setTimeout(() => this.setState({ currentIdx: newIdx, navigating: false }), navigationDelay)
      setRoutePath(this.state.data.content[newIdx].slug, this.state.serverRendering);
    }
  }

  navNext(ev) {
    ev.preventDefault();
    const newIdx = this.state.currentIdx + 1;
    if (this.state.data && this.state.data.content && newIdx < this.state.data.content.length) {
      this.setState({ navigating: true });
      // Delay before setting navigation finished 
      setTimeout(() => this.setState({ currentIdx: newIdx, navigating: false }), navigationDelay)
      setRoutePath(this.state.data.content[newIdx].slug, this.state.serverRendering);
    }
  }

  render() {
    const { loading, navigating, data, currentIdx, error } = this.state;
    const widgetArgs = data && {
      navigating,
      title: data.title,
      content: data.content[currentIdx],
      // Pass navigation callback functions (or null when no nav in a direction)
      navPrev: currentIdx > 0 ? ((ev) => this.navPrev(ev)) : null,
      navNext: data.content.length > 0 && (currentIdx + 1) < data.content.length ? ((ev) => { this.navNext(ev) }) : null,
      nextTitle: data.content.length > 0 && (currentIdx + 1) < data.content.length ? data.content[currentIdx + 1].title : ''
    };

    return (
      <div id="content">
        { data && <Widget {...widgetArgs} /> }
        { error && <Error text={error} /> }
      </div>
    );
  }
}
