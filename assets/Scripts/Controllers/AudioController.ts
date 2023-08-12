import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

enum DisplayAudio {
    BUTTON = "sfx_btn",
    SLIDE = "sfx_slide",
    WRONG = "sfx_wrong"
};

@ccclass('AudioController')
export class AudioController extends Component {
    public static instance: AudioController;

    @property(AudioClip)
    audioSource: AudioClip[] = [];

    onLoad() {
        AudioController.instance = this;
    }

    playAudio<T extends keyof typeof DisplayAudio>(displayAudio: T) {
        let audio = this.audioSource.find((audio) => {
            return audio.name == DisplayAudio[displayAudio];
        });

        this.node.getComponent(AudioSource).clip = audio;
        this.node.getComponent(AudioSource).play();
    }

    update(deltaTime: number) {

    }
}

