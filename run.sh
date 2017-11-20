#echo run build
date +'android start build time:'%Y-%m-%d-%H-%M-%S
rm ../build_file/*.apk

cp ./android/customModules/ShareModule.java ./node_modules/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/share/ShareModule.java


export https_proxy=http://101.231.121.17:80
# rm ../android/local.properties
source ./configEnvScripts/findAndReplace.sh && getFileAndChangeJcenter && changeJSCHeader && changeBuildVersion
#手动修改buildToolVision

cd ../android// && ./gradlew clean

cp -f ../downloadResources/boost_1_57_0.zip ./node_modules/react-native/ReactAndroid/build/downloads/boost_1_57_0.zip

#npm install
cd android && ./gradlew assembleRelease
cd ..

cp ./android/app/build/outputs/apk/*.apk ../build_file
rm ../build_file/*unaligned.apk

date +'android end build time:'%Y-%m-%d-%H-%M-%S
