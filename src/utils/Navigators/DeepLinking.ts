import dynamicLinks from '@react-native-firebase/dynamic-links';
import {Share} from 'react-native';
export const generateLink = async (additional: string) => {
  try {
    const link = await dynamicLinks().buildShortLink(
      {
        link: `https://hustleproductivityapp.page.link/app-use/${additional}}`,
        domainUriPrefix: 'https://hustleproductivityapp.page.link',
        android: {
          packageName: 'com.randomone',
        },
      },
      dynamicLinks.ShortLinkType.DEFAULT,
    );
    console.log('link:', link);
    return link;
  } catch (error) {
    console.log('Generating Link Error:', error);
  }
};

export const shareProduct = async (link: string) => {
  try {
    Share.share({
      message: link,
    });
  } catch (error) {
    console.log('Sharing Error:', error);
  }
};
