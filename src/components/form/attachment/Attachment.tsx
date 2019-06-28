import * as React from "react";
import * as styles from "./Attachment.scss";
import { Button, Icon } from "../Button";
import { uploadFile } from "../../../api/support";
import { takePhoto, isWindVandAvailable, getHostEnvironment, Host } from "../../../api/windvane";
import fetch from 'cross-fetch';
import { blobToFile } from "../../../utils/transformers";
import * as log from 'loglevel';
import { random } from "../../../utils/extras";
import { connect } from "react-redux";
import { showMessage } from "../../../store/alert/actions";
import { trackEvent } from "../../../utils/tracker";
import { isMobile } from "../../../config/environment";

class Attachment extends React.Component<AttachmentProps, AttachmentState> {

    constructor(props: AttachmentProps) {
        super(props);
        this.state = { images: [] };
    }

    thumbnail = (image: Image) => {
        const thumbnailStyle = {
            backgroundImage: `url("${image.thumbnail}")`
        }

        const progressStyle = {
            right: `${100 - Math.round(Math.min(image.progress, 95))}%`,
            borderBottomRightRadius: `${image.progress < 100 ? '2px' : '0px'}`
        }

        return (
            <div style={thumbnailStyle} className={styles.thumbnail} key={`thumbnail-image-${image.addedOn}`}>
                <div className={styles.remove_icon} onClick={() => this.removeImage(image.name)}/>
                {!image.failed && !image.uploaded && <div className={styles.progress_bar}><div className={styles.meter} style={progressStyle}></div></div>}
                {image.failed && <div className={styles.upload_error}>File upload failed!</div>}
                <div className={styles.clear} />
            </div>
        )
    }

    thumbnails = () => {
        return <div className={styles.thumbnails}>{this.state.images.map(this.thumbnail)}<div className={styles.clear}/></div>
    }

    updateImageStatus = (name: string, data: any, callback?: () => void) => {
        const others = this.state.images.filter(im => im.name !== name);
        const match = this.state.images.filter(im => im.name === name)[0];
        let images = [...others];

        if (data) {
            images.push({ ...match, ...data })
        }

        this.setState({ images: images }, callback)
    }

    onProgress = (name: string, done: number, total: number) => {
        this.updateImageStatus(name, { progress: done * 100 / total })
    }

    onComplete = (name: string, url: string | null) => {
        if (url === null) {
            this.updateImageStatus(name, { failed: true, uploaded: false });
        }
        else if (url === 'NA') {
            this.updateImageStatus(name, null);
        }
        else {
            this.updateImageStatus(name, { failed: false, uploaded: true, progress: 100, url: url }, () => {
                if (this.props.onChange) {
                    this.props.onChange(this.state.images.map(im => im.url));
                }
                if (this.props.notifyOnProgress) {
                    this.props.notifyOnProgress(this.onGoingUpload());
                }
            });
        }
    }

    onCancelCallbackReady = (name: string, callback: Function) => {
        this.updateImageStatus(name, { cancel: callback });
    }

    removeImage = (name: string) => {
        let others = this.state.images.filter(im => im.name !== name);
        const match = this.state.images.filter(im => im.name === name).filter(im => im.progress <= 100 && !im.uploaded);
        match.forEach(im => im.cancel());

        if (match.length === 0) {
            others = others.sort((a, b) => a.addedOn - b.addedOn);
            this.setState({ images: [...others] }, () => {
                if (this.props.notifyOnProgress) {
                    this.props.notifyOnProgress(this.onGoingUpload());
                }
            });
        }
    }

    onFileSelect = (event: any) => {
        const file = event.target.files[0];
        event.target.value = null;

        const now = new Date().getMilliseconds();
        const name = `file-${now}-${random(1, 1000)}`;
        
        if (this.state.images.some(im => im.fileObject.lastModified === file.lastModified && im.fileObject.size === file.size)) {
            log.warn('Customer already picked this image');
            return;
        }

        this.setState({
            images: [...this.state.images, { name: name, type: file.type, progress: 0, failed: false, uploaded: false, thumbnail: URL.createObjectURL(file), fileObject: file, addedOn: now }]
        }, () => {
            uploadFile(name, file, this.onProgress, this.onCancelCallbackReady, (url) => this.onComplete(name, url));
        });

        trackEvent('Attachment', 'selection', 'host', isMobile() ? 'mobile-web' : 'desktop-web');
    }

    onWindvaneFileSelect = (url: string) => {
        if (this.props.notifyOnProgress) {
            this.props.notifyOnProgress(false);
        }

        if (url === null) {
            return;
        }

        getHostEnvironment().then(host => {
            if (host === Host.WEB) {
                log.warn('Host is not windvane. Ignoring this image selection.', url);
                return;
            }

            log.info('Attaching the file from alicloud url:', url);

            const now = new Date().getMilliseconds();
            this.setState({
                images: [...this.state.images, { name: name, type: 'image/jpg', progress: 100, failed: false, uploaded: true, thumbnail: url, fileObject: null, addedOn: now, url: url }]
            });
        });

    }

    onTriggerWindvaneFile = () => {
        takePhoto(this.onWindvaneFileSelect);
        if (this.props.notifyOnProgress) {
            this.props.notifyOnProgress(true);
        }

        getHostEnvironment().then(host => {
            trackEvent('Attachment', 'selection', 'host', host);
        });
    }

    onGoingUpload = () => {
        return this.state.images.some(im => !im.uploaded && !im.failed)
    }

    render() {
        const { label } = this.props;

        return (
            <div className={styles.content}>
                <div className={styles.label}>{label}</div>
                {this.state.images.length > 0 && this.thumbnails()}
                {isWindVandAvailable() && <div className={styles.only_mobile}><Button text="Add Photo(s)" onClick={this.onTriggerWindvaneFile} style={{ padding: '16px' }} icon={Icon.ATTACHMENT} isDisabled={this.onGoingUpload()} /></div>}
                {!isWindVandAvailable() && <div className={styles.only_mobile}><Button text="Add Photo(s)" fileProps={{ id: 'file-picker', onChange: this.onFileSelect }} style={{ padding: '16px' }} icon={Icon.ATTACHMENT} isDisabled={this.onGoingUpload()} /></div>}
                {!isWindVandAvailable() && <div className={styles.only_desktop}><Button text="Add Photo(s)" fileProps={{ id: 'file-picker', onChange: this.onFileSelect }} style={{ padding: '13px 50px', display: 'inline-block' }} icon={Icon.ATTACHMENT} isDisabled={this.onGoingUpload()} /></div>}
            </div>
        );
    }
}

interface Image {
    name: string,
    fileObject: File,
    thumbnail: string,
    type: string,      // image/png, image/jpeg
    progress: number,
    url?: string,
    failed: boolean,
    uploaded: boolean,
    cancel?: () => void,
    addedOn: number
}

interface AttachmentState {
    images: Image[]
}

interface SimpleProps {
    label: string,
    onChange?: (urls: string[]) => void,
    notifyOnProgress?: (uploadOnGoing: boolean) => void
}

interface PropsFromDispatch {
    showMessage: (title: string, message: any, btnText: string) => void
}

export type AttachmentProps = SimpleProps & PropsFromDispatch;

const mapDispatchToProps = {
    showMessage: showMessage
}

export default connect(null, mapDispatchToProps)(Attachment);