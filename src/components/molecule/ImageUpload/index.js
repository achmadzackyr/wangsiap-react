import React, { Component } from 'react';
import axios from 'axios';
import * as kon from '../../../constants';

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null
    };
    this.uploadSingleFile = this.uploadSingleFile.bind(this);
    this.upload = this.upload.bind(this);
  }

  uploadSingleFile(e) {
    this.setState({
      file: URL.createObjectURL(e.target.files[0])
    });
  }

  upload() {
    const formData = { image: this.state.file };

    let url = `${kon.API_URL}/upload.php`;
    axios
      .post(url, formData, {
        // receive two parameter endpoint url ,form data
      })
      .then((res) => {
        // then print response status
        console.warn(res.data);
      });
  }

  render() {
    let imgPreview;
    if (this.state.file) {
      imgPreview = <img src={this.state.file} alt="" />;
    }
    return (
      <form>
        <div className="form-group preview">{imgPreview}</div>

        <div className="form-group">
          <input type="file" className="form-control" onChange={this.uploadSingleFile} />
        </div>
        <button type="button" className="btn btn-primary btn-block" onClick={this.upload}>
          Upload
        </button>
      </form>
    );
  }
}

export default ImageUpload;
