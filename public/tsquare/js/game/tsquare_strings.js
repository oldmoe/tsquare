var tsquare_strings = {};
tsquare_strings.en = {};
tsquare_strings.ar = {};

// DESCRIPTION
// tsquare_strings.en['stringKey'] = 'English text';
// tsquare_strings.ar['stringKey'] = 'الكلام بالعربي';

function t(stringKey, argv) {
  var s = tsquare_strings[game.properties.lang][stringKey];
  if (argv) for (var i = 0; i < argv.length; i++) s = s.replace('{' + i + '}', argv[i]);
  return s;
}

// h3 for mission stories
tsquare_strings.en['missionDetailsHeader'] = 'Mission Story';
tsquare_strings.ar['missionDetailsHeader'] = 'تفاصيل المهمة';

// Shows instead of the friend's name under the placeholder image
tsquare_strings.en['inviteFriend'] = 'Invite';
tsquare_strings.ar['inviteFriend'] = 'ادع';

// Displayed when the player gets higher score than some friend
tsquare_strings.en['surpassFriendScore'] = 'You have passed {0}\'s score of {1} !!!';
tsquare_strings.ar['surpassFriendScore'] = 'لقد تجاوزت نقاط {0} التي لم تتعدى {1} !!!';

// Displayed when a friend gets a higher score than the player
tsquare_strings.en['friendSurpassedPlayerScore'] = 'With {1}, {0} passed your score!!';
tsquare_strings.ar['friendSurpassedPlayerScore'] = '{1} نقاط من {0} كانت كافية ليتخطاك!!';

// Suggests a challenge request
tsquare_strings.en['challengeFriend'] = 'Send them a challenge!';
tsquare_strings.ar['challengeFriend'] = 'راسله للدخول في تحدي!';

// Approve action
tsquare_strings.en['approve'] = 'OK';
tsquare_strings.ar['approve'] = 'أوافق';

// Cancel action
tsquare_strings.en['cancel'] = 'Cancel';
tsquare_strings.ar['cancel'] = 'إلغاء';

// Dismiss dialog
tsquare_strings.en['skip'] = 'SKIP';
tsquare_strings.ar['skip'] = 'لاحقا';

// Acknowledge message
tsquare_strings.en['ok'] = 'ok';
tsquare_strings.ar['ok'] = 'حسنا';

// Challenge button
tsquare_strings.en['challenge'] = 'Challenge';
tsquare_strings.ar['challenge'] = 'تحدي';

// xx% of your objectives
tsquare_strings.en['percentageOfObjectives'] = 'of your objectives';
tsquare_strings.ar['percentageOfObjectives'] = 'من أهدافك';

// h5 "Your Score"
tsquare_strings.en['yourScore'] = 'Your Score';
tsquare_strings.ar['yourScore'] = 'مجموع نقاطك';

// Mission completed
tsquare_strings.en['congrats'] = 'Congratulations!';
tsquare_strings.ar['congrats'] = 'أحسنت!';

// Mission completed message
tsquare_strings.en['youPassedThisMission'] = 'You\'ve passed this mission';
tsquare_strings.ar['youPassedThisMission'] = 'لقد أكملت هذه المهمة';

// Mission failed
tsquare_strings.en['badLuck'] = 'Try Again';
tsquare_strings.ar['badLuck'] = 'حاول مجددا';

// Mission failed message
tsquare_strings.en['youFailedThisMission'] = 'You didn\'t pass this mission';
tsquare_strings.ar['youFailedThisMission'] = 'لم تنجح في اتمام هذه المهمة';

// request_help_button
tsquare_strings.en['request_help_button'] = 'Send Help Request';
tsquare_strings.ar['request_help_button'] = 'أرسل استغاثة';

// request_gift_button
tsquare_strings.en['request_gift_button'] = 'Send Gift';
tsquare_strings.ar['request_gift_button'] = 'أرسل هدية';

// request_challenge_button
tsquare_strings.en['request_challenge_button'] = 'Send Challenge';
tsquare_strings.ar['request_challenge_button'] = 'أرسل تحدي';

// h3 title for the inbox
tsquare_strings.en['inbox_header'] = 'Requests';
tsquare_strings.ar['inbox_header'] = 'الرسائل';

// Title of the help requests list
tsquare_strings.en['help_requests'] = 'Help Requests';
tsquare_strings.ar['help_requests'] = 'طلبات المساعدة';

// Title of the gift requests list
tsquare_strings.en['gift_requests'] = 'Gift Requests';
tsquare_strings.ar['gift_requests'] = 'الهدايا';

// Title of the callenge requests list
tsquare_strings.en['challenge_requests'] = 'Challenge Requests';
tsquare_strings.ar['challenge_requests'] = 'التحديات';

// Message-From-Sender
tsquare_strings.en['inbox_message'] = '{1} from {0}';
tsquare_strings.ar['inbox_message'] = '{1} من {0}';

// Upgrade crowd member in the marketplace
tsquare_strings.en['upgrade_crowd_member'] = 'Upgrade';
tsquare_strings.ar['upgrade_crowd_member'] = 'طور';

// Marketplace tab title - Moves
tsquare_strings.en['moves_tab'] = 'Moves';
tsquare_strings.ar['moves_tab'] = 'حركات';

// Marketplace tab title - Members
tsquare_strings.en['members_tab'] = 'Members';
tsquare_strings.ar['members_tab'] = 'ثورجية';

// Marketplace tab title - Items
tsquare_strings.en['items_tab'] = 'Items';
tsquare_strings.ar['items_tab'] = 'حاجيات';

// Marketplace tab title - Powerups
tsquare_strings.en['powerups_tab'] = 'Powerups';
tsquare_strings.ar['powerups_tab'] = 'مقويات';

// Marketplace tab title - Special
tsquare_strings.en['special_tab'] = 'Special';
tsquare_strings.ar['special_tab'] = 'مخصوص';

// Marketplace tab title - Crowd
tsquare_strings.en['crowd_tab'] = 'Crowd Items';
tsquare_strings.ar['crowd_tab'] = 'عدة ثوار';